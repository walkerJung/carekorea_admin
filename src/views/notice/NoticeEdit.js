import React from "react";
import { Card, CardBody, Row, Col, FormGroup, Label, Button } from "reactstrap";
import { useMutation, useQuery } from "@apollo/client";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  NOTICE_LIST_QUERY,
  NOTICE_DETAIL_QUERY,
  NOTICE_EDIT_MUTATION,
} from "../../config/Queries";
import { toast } from "react-toastify";

function NoticeEdit({ match }) {
  const code = parseInt(match.params.id);
  const { data, loading } = useQuery(NOTICE_DETAIL_QUERY, {
    variables: {
      code,
    },
  });
  const history = useHistory();
  const [noticeEditMutation] = useMutation(NOTICE_EDIT_MUTATION, {
    refetchQueries: () => [
      {
        query: NOTICE_LIST_QUERY,
        variables: {
          skip: 0,
          take: 10,
        },
      },
      {
        query: NOTICE_DETAIL_QUERY,
        variables: {
          code,
        },
      },
    ],
  });
  const { register, handleSubmit } = useForm();
  const onSubmit = async (data) => {
    try {
      await noticeEditMutation({
        variables: {
          code,
          title: data.title,
          content: data.content,
        },
      });
      toast.success("공지사항 수정이 완료되었습니다.", {
        autoClose: 3000,
        position: toast.POSITION.TOP_RIGHT,
      });
      history.push("/admin/notices");
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <>
      {!loading && (
        <div className="content">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
              <div className="card-heading">본문</div>
              <CardBody>
                <FormGroup row>
                  <Label for="title" sm={2} className="control-label">
                    제목
                  </Label>
                  <Col sm={10}>
                    <input
                      id="title"
                      name="title"
                      className="form-control"
                      placeholder="제목을 입력해주세요."
                      defaultValue={data?.viewNotice?.title}
                      type="text"
                      ref={register({
                        required: "제목을 입력해주세요.",
                      })}
                    />
                  </Col>
                  <Label for="content" sm={2} className="control-label">
                    내용
                  </Label>
                  <Col sm={10}>
                    <textarea
                      style={{ maxHeight: 200, height: 200 }}
                      id="content"
                      name="content"
                      className="form-control"
                      placeholder="내용을 입력해주세요."
                      defaultValue={data?.viewNotice?.content}
                      ref={register({
                        required: "내용을 입력해주세요.",
                      })}
                    />
                  </Col>
                </FormGroup>
              </CardBody>
            </Card>
            <Row>
              <Col xs={4} className="text-left">
                <Button
                  onClick={() => {
                    history.push("/admin/notices");
                  }}
                  className="btn-white"
                >
                  <i className="fa fa-list"></i>
                  목록
                </Button>
              </Col>
              <Col xs={4} className="text-center">
                <Button type="submit" className="btn-inverse">
                  <i className="fa fa-check"></i>확인
                </Button>
              </Col>
              <Col xs={4} className="text-right"></Col>
            </Row>
          </form>
        </div>
      )}
    </>
  );
}

export default NoticeEdit;
