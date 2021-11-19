import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  InputGroup,
  Input,
  ButtonGroup,
  Button,
} from "reactstrap";
import { useQuery } from "@apollo/client";
import { NOTICE_DETAIL_QUERY } from "../../config/Queries";

function NoticeView({ match }) {
  const code = parseInt(match.params.id);
  const { data, loading } = useQuery(NOTICE_DETAIL_QUERY, {
    variables: {
      code,
    },
  });
  return (
    <>
      {!loading && (
        <div className="content">
          <Row className="m-b-15">
            <Col xs="6" sm="6" className="text-left">
              <Button onClick={() => {}} className="btn-white">
                <i className="fa fa-list"></i>
                목록
              </Button>
            </Col>
            <Col xs="6" sm="6" className="text-right">
              <ButtonGroup className="btn-group">
                <Button onClick={() => {}} className="btn-white text-success">
                  <i className="fas fa-edit"></i>
                  수정
                </Button>
                <Button
                  onClick={() => {}}
                  className="btn btn-white text-danger delete"
                >
                  <i className="fas fa-trash"></i>
                  삭제
                </Button>
              </ButtonGroup>
            </Col>
          </Row>
          <Card>
            <div className="card-heading">{data?.viewNotice?.title}</div>
            <CardBody>
              <div className="underline p-b-15 m-b-15">
                <span className="text-muted m-l-5">
                  작성일 : {data?.viewNotice?.createdAt}
                </span>
              </div>

              <div className="article-editor">{data?.viewNotice?.content}</div>
            </CardBody>
          </Card>
          <Row>
            <Col xs="6" sm="6" className="text-left">
              <Button onClick={() => {}} className="btn-white">
                <i className="fa fa-list"></i>
                목록
              </Button>
            </Col>
            <Col xs="6" sm="6" className="text-right">
              <ButtonGroup className="btn-group">
                <Button onClick={() => {}} className="btn-white text-success">
                  <i className="fas fa-edit"></i>
                  수정
                </Button>
                <Button
                  onClick={() => {}}
                  className="btn btn-white text-danger delete"
                >
                  <i className="fas fa-trash"></i>
                  삭제
                </Button>
              </ButtonGroup>
            </Col>
          </Row>
        </div>
      )}
    </>
  );
}

export default NoticeView;
